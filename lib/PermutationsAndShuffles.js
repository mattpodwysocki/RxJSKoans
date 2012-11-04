/* void Main()
{
   (new int [] {}).Permutations().Dump("Permutations of empty collection");
   (new [] {1}).Permutations().Dump("Permutations of singleton collection");
   (new [] {1,2}).Permutations().Dump("Permutations of doubleton collection");
   (new [] {1,2,3}).Permutations().Dump("Permutations of tripleton
collection");

   Pluck<int>(2)(new [] {1,2,3}).Dump("Pluck second element from a
collection");
   CoPluck<int>(2)(new [] {1,2,3}).Dump("A new collection with all
but the second element");

   (new [] {new [] {1,2,3}, new [] {4,5,6}})
       .Select(Pluck<int>(2))
       .Dump("Map Pluck(2)");

   (new [] {1,2,3}).PluckPair(2).Dump("The plucked element and its residual");
   (new [] {1,2,3}).PluckPairs().Dump("All pluck pairs of a collection");

   (new int [] {}).Permutations2().Dump("Permutations of empty collection");
   (new [] {1}).Permutations2().Dump("Permutations of singleton collection");
   (new [] {1,2}).Permutations2().Dump("Permutations of doubleton collection");
   (new [] {1,2,3}).Permutations2().Dump("Permutations of tripleton
collection");

   (new int [] {}).Riffles(new int [] {}).Dump("All riffles of two
empty collections");
   (new [] {1}).Riffles(new int [] {}).Dump("All riffles of a
singleton and an empty");
   (new int [] {}).Riffles(new [] {4}).Dump("All riffles of an empty
and a singleton");
   (new [] {1}).Riffles(new [] {4}).Dump("All riffles of two singletons");
   (new [] {1,2}).Riffles(new [] {4}).Dump("All riffles of a
doubleton and a singletons");
   (new [] {1}).Riffles(new [] {4,5}).Dump("All riffles of a
singleton and a doubleton");
   (new [] {1,2}).Riffles(new [] {4,5}).Dump("All riffles of two doubletons");
   (new [] {1,2,3}).Riffles(new [] {4,5}).Dump("All riffles of a
tripleton and a doubleton");
   (new [] {1,2}).Riffles(new [] {4,5,6}).Dump("All riffles of a
doubleton and a tripleton");
   (new [] {1,2,3}).Riffles(new [] {4,5,6}).Dump("All riffles of two
tripletons");
}

// Pluck returns a function so it can be mapped over other collections.
public static Func<IEnumerable<T>, T> Pluck<T>(int n)
{   return xs =>
   {   if (n <= 0 || n > xs.Count())
           throw new ArgumentOutOfRangeException("n",
               String.Format("argument must have value between 1 and
{0} inclusive",
                   xs.Count()));
       return xs.ElementAt(n - 1);
   };
}

// CoPluck returns a function so it can be mapped over other collections
public static Func<IEnumerable<T>, IEnumerable<T>> CoPluck<T>(int n)
{   return xs =>
   {   var c = xs.Count();
       if (n <= 0 || n > c)
           throw new ArgumentOutOfRangeException("n",
               String.Format("argument must have value between 1 and
{0} inclusive", c));
        var ys = new List<T>();
        var i = 1;
        foreach (var x in xs)
        {  if (i != n)
               ys.Add(x);
           i++;
       }
       return ys;
   };
}
public static class Extensions
{
public static IEnumerable<IEnumerable<T>> Riffles<T>(this
IEnumerable<T> left, IEnumerable<T> right)
   {   if (left.Count() == 0)
       {   yield return right;
           yield break;
       }
       if (right.Count() == 0)
       {   yield return left;
           yield break;
       }
       foreach (var r in right.Splits().Skip(1).Take(1))
       {   foreach (var l in left.Splits())
           {   foreach (var f in Riffles(l.Second(), r.Second()))
               {   yield return l.First().Concat(r.First()).Concat(f);
               }
           }
       }
   }
   public static T Second<T> (this IEnumerable<T> these)
   {   return these.Skip(1).First();
   }
   public static IEnumerable<IEnumerable<IEnumerable<T>>>
Splits<T>(this IEnumerable<T> these)
   {   var c = these.Count();
       for (var i = 0; i <= c; i++)
           yield return new IEnumerable<T> [2] {these.Take(i), these.Skip(i)};
   }

   public static IEnumerable<T> Append<T>(this IEnumerable<T> these, T that)
   {   foreach (var t in these)
           yield return t;
       yield return that;
   }
   public static IEnumerable<T> Prepend<T>(this IEnumerable<T> these, T that)
   {   yield return that;
       foreach (var t in these)
           yield return t;
   }
   public static IEnumerable<Tuple<T, IEnumerable<T>>>
PluckPairs<T>(this IEnumerable<T> xs)
   {   var c = xs.Count();
       var result = new List<Tuple<T, IEnumerable<T>>>();
       for (var n = 1; n <= c; n++)
       {   var ys = new List<T>();
           var y = default(T);
           var i = 1;
           foreach (var x in xs)
           {  if (i != n)
                   ys.Add(x);
               else
                   y = x;
               i++;
           }
           result.Add(Tuple.Create(y, (IEnumerable<T>)ys));
       }
       return result;
   }
   public static Tuple<T, IEnumerable<T>> PluckPair<T>(this
IEnumerable<T> xs, int n)
   {   var c = xs.Count();
       if (n <= 0 || n > c)
           throw new ArgumentOutOfRangeException("n",
               String.Format("argument must have value between 1 and
{0} inclusive", c));
       var ys = new List<T>();
       var y = default(T);
       var i = 1;
       foreach (var x in xs)
       {  if (i != n)
               ys.Add(x);
           else
               y = x;
           i++;
       }
       return Tuple.Create(y, (IEnumerable<T>)ys);
   }

   // Slow but understandable "reference implementation" of Permutations
   public static IEnumerable<IEnumerable<T>> Permutations2<T>(this
IEnumerable<T> these)
   {   Debug.Assert(these != null);
       // Inherently combinatorial-time algorithm!
       var len = these.Count();
       if (len == 1)
       {   yield return these;
           yield break;
       }
       foreach (var pluckPair in these.PluckPairs())
       {   foreach (var permutation in pluckPair.Item2.Permutations2())
           {   yield return permutation.Prepend(pluckPair.Item1);
           }
       }
   }
   // Faster but more difficult index-based implementation of Permutations
   public static IEnumerable<IEnumerable<T>> Permutations<T>(this
IEnumerable<T> these)
   {   Debug.Assert(these != null);
       // Inherently combinatorial-time algorithm!
       var len = these.Count();
       if (len == 1)
       {   yield return these;
           yield break;
       }
       var source = these.ToArray();
       var result = new T [len];
       for (var i = 0; i < len; i++)
       {   result[0] = source[i];
           var rs = new T [len - 1];
           for (var j = 0; j < len - 1; j++)
           {   if (j < i)
               {   rs[j] = source[j];
               }
               else if (j >= i)
               {   rs[j] = source[j + 1];
               }
           }
           var perms = rs.Permutations();
           foreach (var perm in perms)
           {   var ps = perm.ToArray();
               for(var j = 0; j < len - 1; j++)
                   result[j + 1] = ps[j];
               yield return result;
           }
       }
   }
}
*/
